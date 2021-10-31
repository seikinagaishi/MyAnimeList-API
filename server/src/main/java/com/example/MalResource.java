package com.example;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;

@Path("mal")
public class MalResource {
    
    MalApi malApi = MalApi.getInstance();

    @GET
    public String getAnimes() {
        String animes = "";

        try {
            animes = malApi.doRequest("anime/ranking?&limit=200");
        } catch(Exception ex) {
            System.out.println("Erro: " + ex);
        }

        return animes;
    }

    @GET
    @Path("/list/{username}")
    public String getUserList(@PathParam("username") String username) {
        String userList = "";

        try {
            userList = malApi.doRequest("users/" + username + "/animelist?fields=list_status,%20status,%20average_episode_duration&limit=1000");
        } catch(Exception ex) {
            System.out.println("Erro: " + ex);
        }

        return userList;
    }

    @GET
    @Path("/anime/{id}")
    public String getAnime(@PathParam("id") int id) {
        String anime = "";

        try {
            anime = malApi.doRequest("/anime/" + id);
        } catch(Exception ex) {
            System.out.println("Erro: " + ex);
        }

        return anime;
    }
}
