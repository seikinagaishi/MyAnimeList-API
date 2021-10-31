package com.example;

import java.util.List;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("badges")
public class BadgesResource {
    
    BadgeRepository badgeRepository = new BadgeRepository();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Badge> getListOfBadges() {
        List<Badge> badges = badgeRepository.getBadges();
        return badges;
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Badge getById(@PathParam("id") int id) {
        Badge badge = badgeRepository.getBadge(id);
        return badge;
    }

    @POST
    @Path("/create")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Badge createBadge(Badge badge) {
        Badge createdBadge = badgeRepository.createBadge(badge);
        return createdBadge;
    }

    @PUT
    @Path("/update")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Badge updateBadge(Badge badge) {
        Badge updatedBadge = badgeRepository.updateBadge(badge);
        return updatedBadge;
    }

    @DELETE
    @Path("/{id}")
    public String deleteBadge(@PathParam("id") int id) {
        Badge badge = badgeRepository.getBadge(id);

        if(badgeRepository.deleteBadge(badge)) {
            return "A conquista " + badge.getNome() + " foi removida!";
        } else {
            return "Conquista não encontrada!";
        }
    }
}
