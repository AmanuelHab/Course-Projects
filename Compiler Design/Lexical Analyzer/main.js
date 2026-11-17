const { log, error } = require('console');
const fs = require('fs');

const TokenTypes = Object.freeze({
    NUMBER: 'NUMBER',
    OPERATOR: "OPERATOR",
    LPAREN: "LPAREN",
    RPAREN: "RPAREN",
});

class Token {
    constructor(type, value, line, column){
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
    }

}

class MathLexer{
    constructor (text){
        this.text = text;
        this.pos = 0;
        this.line = 1;
        this.column = 1;
        this.currChar = text.length > 0 ? text[0] : null;
    }

    advance(){
        if (this.currChar === '\n'){
            this.line ++;
            this.column = 1;
        }else{
            this.column++;
        }

        this.pos++;
        if (this.pos < this.text.length){
            this.currChar = this.text[this.pos];
        }
        else{
            this.currChar = null;
        }
    }
    skipSpace(){
        while(this.currChar !== null && /\s/.test(this.currChar)){
            this.advance();
        }
    }
    readNumber(){
        const startLine = this.line;
        const startColumn = this.column;
        let numString = "";
        let dot = false;

        while(this.currChar !== null && /[0-9]/.test(this.currChar) || this.currChar === '.'){
            if(this.currChar === '.'){
                if(dot){
                    throw new Error(`Invalid number with multiple decimal points at line ${this.line}, column ${this.column}`);
                }
                dot = true;
            }
            numString += this.currChar;
            this.advance();
        }
        if(numString === '.'){
            throw new Error(`Unexpected standalone '.' at line ${startLine}, column ${startColumn}`);
        }
        return new Token(TokenTypes.NUMBER, numString, startLine, startColumn);
    }

    tokenize(){
        const tokens = [];
        const stack = [];
        let dot = false;

        while (this.currChar !== null){
            if(/\s/.test(this.currChar)){
                this.skipSpace();
                if (stack.length > 0){
                    tokens.push(new Token(TokenTypes.NUMBER, stack.join(""), this.line, this.column - stack.length - 1));
                    stack.length = 0;
                    dot = false;
                }
                continue;
            }

            if (/[0-9]/.test(this.currChar) || this.currChar === '.'){
                tokens.push(this.readNumber());
                continue;
            }

            if (['+', '-', '*', '/'].includes(this.currChar)){
                tokens.push(new Token(TokenTypes.OPERATOR, this.currChar, this.line, this.column));
            }else if (this.currChar === '('){
                tokens.push(new Token(TokenTypes.LPAREN, this.currChar, this.line, this.column));
            }else if(this.currChar === ')'){
                tokens.push(new Token(TokenTypes.RPAREN, this.currChar, this.line, this.column));
            }else{
                throw new Error(`Unexpected character '${this.currChar}' in line ${this.line} at column '${this.column}'`);
            }
            this.advance();

        }

        return tokens;
    }
}

const fileName = 'code.txt';
try{
    const inputSource = fs.readFileSync(fileName, 'utf8');
    log("File Contents:\n", inputSource);

    const lexer = new MathLexer(inputSource);

    log("First char: ", lexer.currChar);
    const tokens = lexer.tokenize();
    log("Generated Tokens: \n", tokens)

}catch(err){
    error(`Error reading the file(${fileName}): `, err.message)
}
