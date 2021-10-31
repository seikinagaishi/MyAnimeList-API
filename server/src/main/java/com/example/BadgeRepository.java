package com.example;

import java.util.List;
import java.util.ArrayList;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.NoResultException;
import javax.persistence.Persistence;
import javax.persistence.TypedQuery;

public class BadgeRepository {
    
    EntityManager manager = null;
    EntityManagerFactory factory = null;

    public BadgeRepository() {
        factory = Persistence.createEntityManagerFactory("adiproj");
        manager = factory.createEntityManager();
    }
    
    public List<Badge> getBadges() {
        List<Badge> badges = new ArrayList<>();
        String query = "SELECT b FROM Badge b WHERE b.id IS NOT NULL";
        TypedQuery<Badge> typedQuery = manager.createQuery(query, Badge.class);
        
        try {
            badges = typedQuery.getResultList();
        } catch(NoResultException ex) {
            ex.printStackTrace();
        }

        return badges;
    }

    public Badge getBadge(int id) {
        Badge badge = new Badge();
        String query = "SELECT b FROM Badge b WHERE b.id = :id";
        TypedQuery<Badge> typedQuery = manager.createQuery(query, Badge.class);
        typedQuery.setParameter("id", id);


        try {
            badge = typedQuery.getSingleResult();

        } catch(NoResultException ex) {
            ex.printStackTrace();
        }

        return badge;
    }

    public Badge createBadge(Badge badge) {
        EntityTransaction entityTransaction = null;

        try {
            entityTransaction = manager.getTransaction();
            entityTransaction.begin();

            manager.persist(badge);

            entityTransaction.commit();

        } catch(Exception ex) {
            if(entityTransaction != null) {
                entityTransaction.rollback();
            }
            ex.printStackTrace();
        }

        return badge;
    }

    public Badge updateBadge(Badge badge) {
        EntityTransaction entityTransaction = null;

        try {
            entityTransaction = manager.getTransaction();
            entityTransaction.begin();

            manager.merge(badge);

            entityTransaction.commit();

        } catch(Exception ex) {
            if(entityTransaction != null) {
                entityTransaction.rollback();
            }
            ex.printStackTrace();
        }

        return badge;
    }

    public boolean deleteBadge(Badge badge) {
        EntityTransaction entityTransaction = null;

        try {
            entityTransaction = manager.getTransaction();
            entityTransaction.begin();

            badge = manager.find(Badge.class, badge.getId());
            manager.remove(badge);

            entityTransaction.commit();

        } catch(Exception ex) {
            if(entityTransaction != null) {
                entityTransaction.rollback();
            }
            ex.printStackTrace();
        }

        return true;
    }
}
