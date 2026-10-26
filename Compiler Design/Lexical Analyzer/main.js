const { log, error } = require('console');
const fs = require('fs');

const TokenTypes = Object.freeze({
    NUMBER: 'NUMBER',
    OPERATOR: "OPERATOR",
    PARENTHESIS: "PARENTHESIS"
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
        this.line = 0;
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
    tokenize(){
        const tokens = [];
        const stack = [];
        let dot = false;

        while (this.currChar !== null){
            if(/\s/.test(this.currChar)){
                this.skipSpace();
                continue;
            }

            if (/[0-9]/.test(this.currChar) || this.currChar === '.'){
                if (this.currChar === '.'){
                    if (dot){
                        throw new Error(`Invalid number format with multiple decimal points at line: ${this.line} column: ${this.column}`);
                    }
                    dot = true;
                }
                stack.push(this.currChar);
                this.advance();
                continue;
            }
            if (stack.length > 0){
                tokens.push(new Token(TokenTypes.NUMBER, stack.join(""), this.line, this.column));
                stack.length = 0;
                dot = false;
            }

            if (['+', '-', '*', '/'].includes(this.currChar)){
                tokens.push(new Token(TokenTypes.OPERATOR, this.currChar, this.line, this.column));
            }else if (['(', ')'].includes(this.currChar)){
                tokens.push(new Token(TokenTypes.PARENTHESIS, this.currChar, this.line, this.column));
            }else{
                throw new Error(`Unexpected character '${this.currChar}' in line ${this.line} at column '${this.column}'`);
            }
            this.advance();

        }
        if (stack.length > 0){
            tokens.push(new Token(TokenTypes.NUMBER, stack.join(""), this.line, this.column));
            stack.length = 0;
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
