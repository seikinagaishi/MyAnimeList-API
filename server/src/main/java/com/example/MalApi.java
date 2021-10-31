package com.example;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class MalApi {

    private static String URLBase = "https://api.myanimelist.net/v2/";
    private static String token;
    
    private static MalApi instance;

    private CloseableHttpClient clientHTTP;

    private MalApi() {
        this.clientHTTP = HttpClients.createDefault();
    }

    public static MalApi getInstance() {
        if(instance == null) {
            instance = new MalApi();
        }

        return instance;
    }

    public String doRequest(String path) throws IOException {
        String responseBody = null;

        try {
            HttpGet httpGet = new HttpGet(MalApi.URLBase + path);
            httpGet.setHeader("Authorization", token);

            ResponseHandler<String> responseHandler = new ResponseHandler<String>() {
                @Override
                public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
                    int status = response.getStatusLine().getStatusCode();
                    if(status >= 200 && status < 300) {
                        HttpEntity entity = response.getEntity();
                        return entity != null ? EntityUtils.toString(entity) : null;
                    } else {
                        throw new ClientProtocolException("Erro: " + status);
                    }
                }
            };
            responseBody = this.clientHTTP.execute(httpGet, responseHandler);

        } catch(IOException ex) {
            Logger.getLogger(MalApi.class.getName()).log(Level.SEVERE, null, ex);
        }

        return responseBody;
    }
}
