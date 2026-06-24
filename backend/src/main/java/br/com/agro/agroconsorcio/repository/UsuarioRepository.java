package br.com.agro.agroconsorcio.repository;

import br.com.agro.agroconsorcio.model.TipoUsuario;
import br.com.agro.agroconsorcio.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByNomeUsuario(String nomeUsuario);

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdUsuarioNot(String email, Long idUsuario);

    List<Usuario> findByTipoUsuarioOrderByNomeUsuarioAsc(TipoUsuario tipoUsuario);

    List<Usuario> findByTipoUsuarioAndNomeUsuarioContainingIgnoreCaseOrderByNomeUsuarioAsc(
            TipoUsuario tipoUsuario,
            String nomeUsuario
    );

    List<Usuario> findByTipoUsuarioAndEmailContainingIgnoreCaseOrderByNomeUsuarioAsc(
            TipoUsuario tipoUsuario,
            String email
    );
}