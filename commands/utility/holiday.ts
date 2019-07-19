exports.run = async (client: any, message: any, args: string[]) => {
    const axios = require('axios');
    let data = await axios.get("https://nationaldaycalendar.com/");
    const {parse} = require('node-html-parser');
 
    const root = parse(data.data);
    console.log(root.structure);
}