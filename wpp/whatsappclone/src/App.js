import React, { useState, useEffect } from 'react'; //importa react padrão,// Declarar uma nova variável de state, useEffect dentro do componente nos permite acessar o state count hook de efeito
import './App.css'; //inclue o css.js 

import Api from './Api';//api´s do firebase

import ChatListItem from './components/ChatListItem';
import ChatIntro from './components/ChatIntro';/*import para funcionar a conexão de um arquivo para o outro */
import ChatWindow from './components/ChatWindow';
import NewChat from './components/NewChat';
import Login from './components/Login';

import DonutLargeIcon from '@material-ui/icons/DonutLarge';//importado icone wpp pego no site botão de click status
import ChatIcon from '@material-ui/icons/Chat';//icone de chat
import MoreVertIcon from '@material-ui/icons/MoreVert';//3 pontinhos verticais icon
import SearchIcon from '@material-ui/icons/Search';/*icone lupa pesquisa */

export default () => {//exporta para pagina

  const [chatlist, setChatList ] = useState([]);/*chatlist como array constante vazio */
  const [activeChat, setActiveChat] = useState({});//qual chat q esta ativo identificar ou não se esta
  const [user, setUser] = useState(null);/*processo de login, informaçoes do usuario logado, informaçoes abaixo para não precisar fazer login toda vez q entrar colocando dados do firestone criados */
   // const [user, setUser] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);//abrir e fechar a pagina de newChat
  
  useEffect(()=>{
    if(user !== null){//se for diferende de nulo ou tiver usuario
      let unsub = Api.onChatList(user.id, setChatList);//usa setChatList firebase lista de chats
      return unsub;
    }
  }, [user]);

  const handleNewChat = () => {//true para ir para newChat
    setShowNewChat(true);
  }

  const handleLoginData = async (u) => {//apos feito login vem com dados usuario..
    let newUser = {
      id: u.uid, //id mesmo disponibilizao face
      name: u.displayName,//nome do usuario facebook
      avatar: u.photoURL//avatar foto
    };
     await Api.addUser(newUser);//// registrar no bd ou add no banco de dados newUser
     setUser(newUser);//seta como novo usuario e mostra wpp
   }

  if(user ===null) {//se o usuario for nulo
    return(<Login  onReceive={handleLoginData}/>)//retornará ao login
  }

return (//retorna para pagina texto div
      
  /*janela aplicativo */
  <div className="app-window">
    
     {/* Lado esquerdo abaixo onde tem os contatos */}
    <div className="sidebar">
    <NewChat
        chatlist={chatlist}
        user={user} 
        show={showNewChat}
        setShow={setShowNewChat}
    />{/*importado e colocado no return pro arquivo rodar, abrir e fechar com showNewChat */}
        <header>{/*cabeçario */}
         <img className="header--avatar" src={user.avatar} alt=""/>{/*avatar icone do usuario */}
             <div className="header--buttons">{/*botoes*/}
             <div className="header--btn">{/*area do botão */}
              <DonutLargeIcon style={{color: '#919191'}}/>{/*clica p ver status, style muda cor */}
            </div>
            <div onClick={handleNewChat} className="header--btn">{/*botão click para ir em newChat nova conversa */}
              <ChatIcon style={{color: '#919191'}}/>{/*chat icone ja importado */}
            </div>
            <div className="header--btn">
              <MoreVertIcon style={{color: '#919191'}}/>{/*3 pontinhos vertical... */}
            </div>
             </div>
        </header>

        <div className="search">{/*pesquisa wpp lupa */}
         <div className="search--input">
           <SearchIcon fontSize="small" style={{color: '#919191'}}/>{/*tamanho pouco menor small,SearchIcon=icone lupa  */}
            <input type="search" placeholder="Procurar ou começar uma nova conversa" />{/*search digitação, placeholder escrito dentro */}
         </div>
        ...
    
        </div>

        <div className="chatlist"> {/*lista de usuarios de conversa, chatList jogado no map, key primeiro para funcionar loop */}
        {chatlist.map((item, key)=>(// método map invoca a função callback para cada do Array e devolve novo Array como resultado
            <ChatListItem
              key={key}
              data={item}/*mandar objetos informaçoes */
              active={activeChat.chatId === chatlist[key].chatId}/*activechat igual chatlist key para gerar cor cinza em algum usuario active */
              onClick={()=>setActiveChat(chatlist[key])}/*click para aparecer o chat wpp */
            />         
          ))}     
  
        </div>
  </div>

  {/* Lado direito area do conteudo conversa ou tela de introdução sem conversa abaixo */}
  <div className="contentarea">
  {activeChat.chatId !== undefined && /*id qual chat aberto.. for diferente de indefinido quer dizer q tem chatWindow */
          <ChatWindow 
            user={user}
            data={activeChat}
          />/*user de chatWindow.js, data activeChat nome pessoa mensagem chat o id...*/
        }
        {activeChat.chatId === undefined && /*e quando for indefinido não tem nenhum chat ativo ou.. mostra ChatIntro */
          <ChatIntro />
        }    
  </div>
  </div>
);

}