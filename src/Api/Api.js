

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

let headerURLEncoded = {
    // Accept: '*/*',
    // 'Content-Type': 'multipart/form-data',
};


const PostApi = async (url, data, patch) => {
    console.log('data', data)
    const requestOptions = {
        method: patch == false ? 'POST' : 'PATCH',
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: 'follow'
    };
    console.log('url', url)
    console.log('requestOptions', requestOptions)
    return fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log('post - result', result);
            let data = JSON.parse(result);
            return data;
        })
        .catch(error => {
            console.log('error', error)
            return error;
        });
}
const PostApiImage = async (url, data) => {
    const requestOptions = {
        method: 'POST',
        //   headers: {},
        body: data,
        redirect: 'follow'
    };
    console.log('requestOptions', requestOptions, JSON.stringify(data))
    console.log('url', url)
    return fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log('post - result', result);
            let data = JSON.parse(result);
            return data;
        })
        .catch(error => {
            console.log('error', error)
            return error;
        });
}


const GetApi = url => {
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch(url, requestOptions)
        .then(async response => response.json())
        .then(data => {
            //   console.log('GET API RESPONSE', data);
            return data;
        })
        .catch(error => {
            console.error('there was an error!', error);
            return error.message
        });
}

const deleteApi = async url => {
    const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
    };
    return (
        fetch(url, requestOptions)
            .then(async response => {
                // response.json();
                console.log('DELETE API RESPONSE: ', response);
                return response.json();
            })
            // .then(async response => response.json())
            // .then(data => {
            //   console.log('DELETE API RESPONSE: ', data);
            //   return data;
            // })
            .catch(error => {
                console.error('There was an error!', error);
                return error.message;
            })
    );
};


export { PostApi, GetApi, PostApiImage, deleteApi }