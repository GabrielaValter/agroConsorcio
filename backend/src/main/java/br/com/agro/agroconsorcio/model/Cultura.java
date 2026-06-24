package br.com.agro.agroconsorcio.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cultura")
@Getter
@Setter
@NoArgsConstructor
@Schema(description = "Entidade que represneta a cultura do sistema")
public class Cultura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cultura")
    @Schema(description = "Id da cultura")
    private Long idCultura;

    @NotBlank(message = "O nome da cultura é obrigatório")
    @Column(name = "nome_cultura", nullable = false, length = 100)
    @Schema(description = "Nome da cultura a ser cadastrada", example = "Alface americana")
    private String nomeCultura;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "O tipo da cultura é obrigatório")
    @Column(name = "tipo_cultura", nullable = false)
    @Schema(description = "Tipo da cultura", example = "FOLHAS")
    private TipoCultura tipoCultura;

    @Column(name = "familia", length = 50)
    @Schema(description = "Família da cultura", example = "Asteraceae")
    private String familia;

    @Positive(message = "O tempo estimado deve ser positivo")
    @Column(name = "tempo_estimado")
    @Schema(description = "Tempo estimado da colheita em dias", example = "90")
    private Integer tempoEstimado;

    @Positive(message = "O espaço entre plantas deve ser positivo")
    @Column(name = "espaco_plantas")
    @Schema(description = "Espaçamento entre plantas em cm", example = "30")
    private Integer espacoPlantas;

    @Positive(message = "O espaço entre linhas deve ser positivo")
    @Column(name = "espaco_linhas")
    @Schema(description = "Espaçamento entre linhas em cm", example = "40")
    private Integer espacoLinhas;

    @Positive(message = "A quantidade de sementes por cova deve ser positiva")
    @Column(name = "semente_cova")
    @Schema(description = "Quantidade recomendada de sementes por cova", example = "3")
    private Integer sementeCova;

    @Column(name = "demanda_nutricional", columnDefinition = "TEXT")
    @Schema(description = "Demanda nutricional da cultura")
    private String demandaNutricional;

    @Column(name = "observacao_cultura", columnDefinition = "TEXT")
    @Schema(description = "Observações da cultura")
    private String observacaoCultura;

    @Column(name = "arquivo_foto")
    @Schema(description = "URL ou caminho da foto da cultura")
    private String arquivoFoto;

    // região principal
    @Enumerated(EnumType.STRING)
    @Column(name = "regiao_plantio")
    @Schema(description = "Região principal de plantio")
    private RegiaoPlantio regiaoPlantio;

    // norte
    @Column(name = "mes_inicio_norte")
    private Integer mesInicioNorte;

    @Column(name = "mes_fim_norte")
    private Integer mesFimNorte;

    // nordeste
    @Column(name = "mes_inicio_nordeste")
    private Integer mesInicioNordeste;

    @Column(name = "mes_fim_nordeste")
    private Integer mesFimNordeste;

    // centro-oeste
    @Column(name = "mes_inicio_centro_oeste")
    private Integer mesInicioCentroOeste;

    @Column(name = "mes_fim_centro_oeste")
    private Integer mesFimCentroOeste;

    // sudeste
    @Column(name = "mes_inicio_sudeste")
    private Integer mesInicioSudeste;

    @Column(name = "mes_fim_sudeste")
    private Integer mesFimSudeste;

    // sul
    @Column(name = "mes_inicio_sul")
    private Integer mesInicioSul;

    @Column(name = "mes_fim_sul")
    private Integer mesFimSul;

    // usuário responssável pelo cadastro
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    @Schema(description = "Usuário responsável pelo cadastro")
    private Usuario usuario;
}
