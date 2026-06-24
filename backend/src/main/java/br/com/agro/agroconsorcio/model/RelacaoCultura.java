package br.com.agro.agroconsorcio.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "relacao_cultura")
@Getter
@Setter
@NoArgsConstructor
@Schema(description = "Entidade que representa uma relação de consórcio entre culturas")
public class RelacaoCultura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_relacao")
    @Schema(description = "Id da relação entre culturas")
    private Long idRelacao;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "O tipo da relação é obrigatório")
    @Column(name = "tipo_relacao", nullable = false, length = 20)
    @Schema(description = "Tipo da relação entre culturas", example = "RECOMENDADA")
    private TipoRelacao tipoRelacao;

    @NotBlank(message = "A justificativa é obrigatória")
    @Column(name = "justificativa", nullable = false, columnDefinition = "TEXT")
    @Schema(description = "Justificativa da relação entre as culturas")
    private String justificativa;

    @Column(name = "link_referencia", columnDefinition = "TEXT")
    @Schema(description = "Link de referência utilizado para justificar a relação")
    private String linkReferencia;

    @Column(name = "ano_referencia")
    @Schema(description = "Ano da referência utilizada", example = "2024")
    private Integer anoReferencia;

    @Column(name = "observacao_consorcio", columnDefinition = "TEXT")
    @Schema(description = "Observações adicionais sobre o consórcio")
    private String observacaoConsorcio;

    @NotBlank(message = "A assinatura das culturas é obrigatória")
    @Size(max = 100, message = "A assinatura das culturas deve ter no máximo 100 caracteres")
    @Column(name = "assinatura_culturas", nullable = false, unique = true, length = 100)
    @Schema(description = "Assinatura única da combinação de culturas", example = "1-3-5")
    private String assinaturaCulturas;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    @Schema(description = "Usuário responsável pelo cadastro da relação")
    private Usuario usuario;

    @OneToMany(mappedBy = "relacaoCultura", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"relacaoCultura", "hibernateLazyInitializer", "handler"})
    @Schema(description = "Culturas associadas a esta relação")
    private List<CulturaAssociada> culturasAssociadas = new ArrayList<>();
}