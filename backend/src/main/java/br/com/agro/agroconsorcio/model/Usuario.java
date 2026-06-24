package br.com.agro.agroconsorcio.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@Schema(description = "Entidade que representa o usuário do sistema")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    @Schema(description = "Id do usuáro")
    private Long idUsuario;

    @NotBlank(message = "O nome é obrigatório")
    @Column(name = "nome_usuario", nullable = false, length = 80)
    @Schema(description = "Nome do usuario a ser cadastrado", example = "João Silva")
    private String nomeUsuario;

    @Email(message = "Email inválido")
    @NotBlank(message = "O email é obrigatório")
    @Column(name = "email", nullable = false, length = 100, unique = true )
    @Schema(description = "Email do usuário a ser cadastrado", example = "joao@email.com")
    private String email;

    @JsonIgnore //serve para não mostrar a senha na listagem
    @NotBlank(message = "A senha é obrigatória")
    @Column(name = "senha", nullable = false, length = 255 )
    @Schema(description = "Senha para o usuário acessar a conta")
    private String senha;

    @Column(name = "telefone", length = 20)
    @Schema(description = "Telefone de contato do usuário", example = "(55) 9 9999-9999")
    private String telefone;

    @NotNull(message = "O tipo do usuário é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_usuario", nullable = false)
    @Schema(description = "Tipo do usuário", example = "COLABORADOR")
    private TipoUsuario tipoUsuario;
}
