package PortalTesista.controller.dto;

import lombok.Data;

@Data
public class SaludoResponse {
    private String saludo;
    public SaludoResponse() {
        this.saludo = "Hola desde API-PortalTesista";
    }
    public SaludoResponse(String saludo) {
        this.saludo = saludo;
    }
}