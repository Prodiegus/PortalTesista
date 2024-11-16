package PortalTesista.controller;

import PortalTesista.Service.IkeycloakService;
import PortalTesista.controller.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/keycloak/user")
@PreAuthorize("hasRole('guia') or hasRole('cargo')")
public class KeycloakController {
    @Autowired
    private IkeycloakService keycloakService;

    @GetMapping("/search")
    public ResponseEntity<?> findAllUsers() {
        return ResponseEntity.ok(keycloakService.findAllUsers());
    }

    @GetMapping("/search/{username}")
    public ResponseEntity<?> searchUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(keycloakService.searchUserByUsername(username));
    }

@PostMapping("/create")
public ResponseEntity<?> createUser(@RequestBody UserDTO userDTO) throws URISyntaxException {
    String response = keycloakService.createUser(userDTO);
    if (response.equals("User created successfully")) {
        return ResponseEntity.created(new URI("/keycloak/user/create")).body(response);
    } else {
        return ResponseEntity.badRequest().body(response);
    }
}

    @PutMapping("/update/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody UserDTO userDTO){
        keycloakService.updateUser(userId, userDTO);
        return ResponseEntity.ok("User updated");
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId){
        keycloakService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
