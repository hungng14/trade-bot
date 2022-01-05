require('../src/bot-listener')

exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
    };
    // if (String(event.httpMethod).toLocaleLowerCase() !== 'post') {
    //     return {
    //         statusCode: 404,
    //         body: 'Page not found',
    //     };
    // }
    // const body = convertBody(event.body);
    // await writeFile({
    //     values: [
    //         body.email || '',
    //         new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
    //     ],
    // });
    // return {
    //     statusCode: 200,
    //     body: JSON.stringify({ success: true }),
    // };
};