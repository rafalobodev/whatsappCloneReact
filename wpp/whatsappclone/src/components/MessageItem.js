import React, {useState, useEffect} from 'react';
import './MessageItem.css';

export default ({data, user}) => {//data possuira nome e mensagem... user usuario

  const [time, setTime] = useState('');//tempo de mensagens

  useEffect(()=>{//apenas formatação correta da data
    if(data.date > 0) {
      let d = new Date(data.date.seconds * 1000);//date hora da propria mensagem
      let hours = d.getHours();
      let minutes = d.getMinutes();
      hours = hours < 10 ? '0'+hours : hours;
      minutes = minutes < 10 ? '0'+minutes : minutes;
      setTime(`${hours}:${minutes}`);
    }
  },[data]);

    return (
         <div 
        className="messageLine" style={{
            justifyContent:user.id === data.author ? 'flex-end' : 'flex-start' /*se eu for autor user da mensagem fica lado direito se não é fulano ai esquerdo */
          }}>{/*cada mensagem é a linha inteira.. flex end a mensagem vai para direita final e flex start para lado esquerdo diferenciando assim quem manda mensagem para quem */}
        <div className="messageItem" 
        style={{ backgroundColor: user.id === data.author ? '#DCF8C6' : '#FFF'}}>{/*mensagem texto e data, mudando a cor para cada usuario diferenciar */}
        <div className="messageText">{data.body}</div>{/*texto em si mensagem enviada */}
        <div className="messageDate">{time}</div>{/*horario */}


        </div>

        </div>
    );
}