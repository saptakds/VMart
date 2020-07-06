package com.tmsl.vmart.utils;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
//import org.apache.http.client.HttpClient;
//import org.apache.http.HttpRequest;
//import org.apache.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

import org.apache.http.client.utils.URIBuilder;

public class HttpRequester {
	
	private static final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .connectTimeout(Duration.ofSeconds(60))
            .build();
	
	public static String getResponseGET(String url,Map<String,String> params) throws IOException, 
	InterruptedException, URISyntaxException{
		URIBuilder uriBuilder=new URIBuilder(url);
		for(String k:params.keySet())
		{
			uriBuilder.setParameter(k, params.get(k));
		}
		HttpRequest request = HttpRequest.newBuilder()
		        .GET()
		        .uri(uriBuilder.build())
		        .setHeader("User-Agent", "Java 11 HttpClient Bot")
		        .build();
		HttpResponse<String> response = httpClient
				.send(request, HttpResponse.BodyHandlers.ofString());
		return response.body();
	}

}