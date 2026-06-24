package br.com.agro.agroconsorcio.repository;

import br.com.agro.agroconsorcio.model.Cultura;
import br.com.agro.agroconsorcio.model.TipoCultura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CulturaRepository extends JpaRepository<Cultura, Long> {
    // busca cultura pelo nome
    Optional<Cultura> findByNomeCultura(String nomeCultura);

    // verificar se já existe cultura com mesmo nome
    boolean existsByNomeCultura(String nomeCultura);

    // verificar se já existe cultura com mesmo nome para editar
    boolean existsByNomeCulturaAndIdCulturaNot(String nomeCultura, Long idCultura);

    // listar todas ordenadas por nome
    List<Cultura> findAllByOrderByNomeCulturaAsc();

    // lista por tipo ordenada por nome
    List<Cultura> findByTipoCulturaOrderByNomeCulturaAsc(TipoCultura tipoCultura);

    // lista por região principal (manter para uso futuro)
//    List<Cultura> findByRegiaoPlantio(RegiaoPlantio regiaoPlantio);

    // busca por nome contendo texto ordenada por nome
    List<Cultura> findByNomeCulturaContainingIgnoreCaseOrderByNomeCulturaAsc(String nome);

}