import {APIClient, createClient} from "fakku";

exports.run = async (client: any, message: any, args: string[]) => {
    let fakku = createClient();
    fakku.heartbeat();

    fakku = new APIClient();
    
    fakku.tagged('ahegao') 
    .page()
    .items()
    .then(function (results) {
    return fakku.read(results[0].content_url, 'english');
    }).then(function (root) {
    console.log('READING DATA', root);
    }, function (reason) {
    console.log('ERROR', reason);
    });

}