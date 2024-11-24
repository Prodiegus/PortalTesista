package PortalTesista.controller.dto;

import lombok.Data;

@Data
public class RoleResponse {
    private String role;
    public RoleResponse() {
        this.role = "no role found";
    }
    public RoleResponse(String role) {
        this.role = role;
    }
}