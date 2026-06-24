package br.com.agro.agroconsorcio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioEdicaoDTO(

    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 80, message = "O nome deve ter no máximo 80 caracteres")
    String nomeUsuario,

    @Email(message = "Email inválido")
    @NotBlank(message = "O email é obrigatório")
    @Size(max = 100, message = "O email deve ter no máximo 100 caracteres")
    String email,

    @Size(max = 20, message = "O telefone deve ter no máximo 20 caracteres")
    String telefone,

    String senhaAtual,

    @Size(min = 8, message = "A nova senha deve ter no mínimo 8 caracteres")
    String novaSenha,

    String confirmarNovaSenha
) {}
