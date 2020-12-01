import React from 'react';/*tela basica de login atraves do facebook conta */
import Api from '../Api';
import './Login.css';

export default ({onReceive}) => {

  const handleFacebookLogin = async () => {//função assincrona:escrever código baseado em promessa como se fosse síncrono, mas sem bloquear o segmento principal. 
    let result = await Api.fbPopup();//abre popup esperou resultado e manda results,,,await uma promessa, a função está pausada de uma forma não-bloqueadora, até que a promessa seja concluída. Se a promessa cumprir, você obtém o valor de volta. Se a promessa rejeitar, o valor rejeitado é descartado.
    if (result) {//se deu certo ou não
      onReceive(result.user);//pega informaçoes do usuario
    }else {
      alert("Erro!");
    }
  }

  return (
    <div className="login">
      <button onClick={handleFacebookLogin}>Logar com Facebook</button>{/*botão para logar com facebook */}
    </div>
  )
}