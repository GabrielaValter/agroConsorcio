package br.com.agro.agroconsorcio.repository;

import br.com.agro.agroconsorcio.model.RelacaoCultura;
import br.com.agro.agroconsorcio.model.TipoRelacao;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RelacaoCulturaRepository extends JpaRepository<RelacaoCultura, Long> {

    Optional<RelacaoCultura> findByAssinaturaCulturas(String assinaturaCulturas);

    boolean existsByAssinaturaCulturas(String assinaturaCulturas);

    boolean existsByAssinaturaCulturasAndIdRelacaoNot(String assinaturaCulturas, Long idRelacao);

    @EntityGraph(attributePaths = {"culturasAssociadas", "culturasAssociadas.cultura"})
    List<RelacaoCultura> findAllByOrderByAssinaturaCulturasAsc();

    @EntityGraph(attributePaths = {"culturasAssociadas", "culturasAssociadas.cultura"})
    List<RelacaoCultura> findByTipoRelacaoOrderByAssinaturaCulturasAsc(TipoRelacao tipoRelacao);

    @EntityGraph(attributePaths = {"culturasAssociadas", "culturasAssociadas.cultura"})
    Optional<RelacaoCultura> findById(Long id);
}