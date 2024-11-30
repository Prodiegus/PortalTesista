package PortalTesista.controller.dto;

public class NameResponse {
    private String name;

    public NameResponse() {
        this.name = "No name found";
    }

    public NameResponse(String name) {
        this.name = name;
    }
}
