package PortalTesista.controller.dto;

import lombok.Data;

@Data
public class NameResponse {
    private String name;

    public NameResponse() {
        this.name = "No name found";
    }

    public NameResponse(String name) {
        this.name = name;
    }
}