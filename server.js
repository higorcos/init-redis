require('dotenv').config();
const axios = require('axios')
const  redis = require('redis');
const client = redis.createClient();
client.connect();

const saveDataInCache = async (keyCache) =>{
    try{
        const resultGet = await client.get(keyCache);
        // console.log(resultGet)
        if(resultGet){
            console.log("Em Cache")
            console.timeEnd('time');
            // return {err: false , data: resultGet}//Quando for do arquivo file
            return {err: false , data: JSON.parse(resultGet)}

        }else{
            console.log("Cache Invalido")
            // readTxt('file.txt','infor_file')
            api(keyCache)
            return {err: false , data: resultGet}
        }
    }catch(err){
        console.error('erro',err)
        return {err: true , data: resultGet}

    }
        
}


const readTxt = async (path,keyCache) =>{
    const fs = require('fs');
    // Caminho do arquivo a ser lido
    const caminhoArquivo = path;
    
    // ler o arquivo
    try {
        // Operação assíncrona: Ler um arquivo
        const data = await fs.promises.readFile(caminhoArquivo, 'utf8');
        //Outras leituras para aumentar o tempo de execução


        console.log('Leu arquivo agora');
        try{
            await client.set(keyCache,data, {"EX": 30});
            console.timeEnd('time');
            return {err: false , data: [data]}
        }catch(erro){
            console.error('erro')
            console.error(erro)
        }
    } catch (err) {
        
        console.error('Erro ao ler o arquivo:', err);
        return {err: true , data: []}
        
    }
    
}

const api = async (keyCache)=>{

    try{
        const {data} = await axios.get(process.env.url);
        // console.log(data)
        
        await client.set(keyCache, JSON.stringify(data), {"EX": 10});
        console.timeEnd('time');
    }catch(err){
        console.error(err);        
    }
}


console.time('time');
saveDataInCache('infor_file')




