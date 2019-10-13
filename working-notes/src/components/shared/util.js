export const getIndexOfObject = (value, list, column) => {
    for(let i =0; i < list.length; i++){
        if(list[i][column] === value){
            return i;
        }
    }
    return -1;
}