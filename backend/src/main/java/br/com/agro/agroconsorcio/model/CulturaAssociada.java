package br.com.agro.agroconsorcio.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "cultura_associada",
        uniqueConstraints = {
            @UniqueConstraint(columnNames = {"id_relacao", "id_cultura"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@Schema(description = "Entidade que representa uma cultura associada a uma relação de consórcio")
public class CulturaAssociada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cultura_associada")
    @Schema(description = "Id da cultura associada")
    private Long idCulturaAssociada;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_relacao", nullable = false)
    @JsonIgnoreProperties({"culturasAssociadas", "hibernateLazyInitializer", "handler"})
    @Schema(description = "Relação de consórcio à qual a cultura pertence")
    private RelacaoCultura relacaoCultura;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cultura", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @Schema(description = "Cultura vinculada à relação de consórcio")
    private Cultura cultura;
}