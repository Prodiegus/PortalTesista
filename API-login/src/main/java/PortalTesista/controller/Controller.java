package PortalTesista.controller;

import PortalTesista.controller.dto.SaludoResponse;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class Controller {

    @GetMapping("/")
    public SaludoResponse saludo() {
        return new SaludoResponse();
    }

    @GetMapping("/cargo")
    @PreAuthorize("hasRole('cargo')")
    public SaludoResponse holaCargo() {
        return new SaludoResponse("Hola profesor a Cargo");
    }

    @GetMapping("/guia")
    @PreAuthorize("hasRole('guia')")
    public SaludoResponse holaGuia() {
        return new SaludoResponse("Hola profesor Guia");
    }

    @GetMapping("/alumno")
    @PreAuthorize("hasRole('alumno')")
    public SaludoResponse holaTesista() {
        return new SaludoResponse("Hola alumno Tesista");
    }
}