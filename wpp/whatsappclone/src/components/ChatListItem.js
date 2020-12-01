import React, {useState, useEffect} from 'react';
import './ChatListItem.css';//importa css do chatlist

export default ({onClick, active, data}) => {//exporta para app.js.. recebe onclick
  
  const [time, setTime] = useState('');//tempo de mensagens

  useEffect(()=>{
    if(data.lastMessageDate > 0) {//se tem alguma data
      let d = new Date(data.lastMessageDate.seconds * 1000);//nova data multiplica por 1000
      let hours = d.getHours();//horas
      let minutes = d.getMinutes();//minutos
      hours = hours < 10 ? '0'+hours : hours;//09 horas.. menor q 10h
      minutes = minutes < 10 ? '0'+minutes : minutes;
      setTime(`${hours}:${minutes}`);//seta horario formatado corretamente
    }
  },[data]);

  return (
    <div 
      className={`chatListItem ${active?'active':''}`}//propria div q vai pegar todo item do chat a esquerda e organiar contatos.. active for true
      onClick={onClick}/*recebe on click para aparecer bate papo ou seja chatWindow */
    >
      <img className="chatListItem--avatar" src={data.image} alt=""/>{/*avatar da pessoa */}
      <div className="chatListItem--lines">{/*duas linhas conteudo */}
        <div className="chatListItem--line">
          <div className="chatListItem--name">{data.title}</div>{/*nome aki e horario time abaixo */}
          <div className="chatListItem--date">{time}</div>{/*horario mensagens */}
        </div>
        <div className="chatListItem--line">
        <div className="chatListItem--lastMsg">{/*ultimas mensagens */}
          <p>{data.lastMessage}</p>{/*ultima mensagem recebida */}
        </div>
        </div>
      </div> 
    </div>
  );
}