import { useEffect } from "react";

/**
 * /palco é uma página HTML estática (public/palco/index.html) com todas as tags.
 * Quando o app React recebe /palco (sem barra final), redireciona para o arquivo
 * estático mantendo UTMs e hash, evitando a tela 404.
 */
const PalcoRedirect = () => {
  useEffect(() => {
    const { search, hash } = window.location;
    window.location.replace(`/palco/index.html${search}${hash}`);
  }, []);
  return null;
};

export default PalcoRedirect;
