import React from 'react';

export const getIndexOfObject = (value, list, column) => {
    for(let i =0; i < list.length; i++){
        if(list[i][column] === value){
            return i;
        }
    }
    return -1;
}

export const readOnlyPageDisplay = (textPass)  =>{
    let temp= []
    temp.push(textPass)
    return textPass.texts.map((a) =>
        <pre>{a.text}</pre>
    );
}

export const readOnlyNoteDisplay = (textPass) => {
    let temp = [];
    temp.push(textPass);
    return temp.map((a) =>
        <pre>{a.text}</pre>
    );
}