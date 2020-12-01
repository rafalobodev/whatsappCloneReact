import React, {useState, useEffect, useRef} from 'react';/*useState é um Hook que te permite adicionar o state do React a um componente de função */
import EmojiPicker from 'emoji-picker-react';/*importar os emojis em gerais */
import './ChatWindow.css';

import Api from '../Api';

import MessageItem from './MessageItem';/*import mesage body */

import SearchIcon from '@material-ui/icons/Search';/*pego no site icone de busca lupa */
import AttachFileIcon from '@material-ui/icons/AttachFile';/*grampo de enviar foto e arquivo */
import MoreVertIcon from '@material-ui/icons/MoreVert';/*icone 3 pontinhos */
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';/*icone emoji */
import CloseIcon from '@material-ui/icons/Close';/*close X fechar icone */
import SendIcon from '@material-ui/icons/Send';/*enviar > icone */
import MicIcon from '@material-ui/icons/Mic';/*microfone icone */

export default ({user, data}) => {//user: sera usuario proprio com login, data:conectando dados firebase

  const body = useRef();//usa o hook useRef q foi importado acima

  // Escuta pelo microfone do navegador para colocar as palavras
  let recognition = null;/*reconhecimento como nulo */
  let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;// de um ou outro webkit..
  if (SpeechRecognition !== undefined) {//se speech esta diferende de undefined
    recognition = new SpeechRecognition();//então instancia..
    console.log("mic:", recognition);
  }

  const [emojiOpen, setEmojiOpen] = useState(false);/*inicia useStates como falso de abrir emoji.. */
  const [text, setText] = useState('');/*salvar os texto digitados mensagem */
  const [listening, setListening] = useState(false);//seta State inicialmente como false ouvir audio
  const [list, setList] = useState([]);//novo states sobre list inicia com array vazio
  const [users, setUsers] = useState([]);//lista de usuarios firebase

useEffect(()=>{//para monitorar mensagens no chat
  setList([]);
  let unsub = Api.onChatContent(data.chatId, setList, setUsers);//monitora chatContent, setar usuarios
  return unsub;
},[data.chatId])//monitora id do chat 

useEffect(()=>{//useEffect importado acima criar efeito quando chegar no final da barra de rolagem
  // Verifica a existencia de barra de rolagem
  if(body.current.scrollHeight > body.current.offsetHeight){//conteudo tem dentro body maior q a altura se sim..
    body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;//tem barra rolagem joga para baixo..
  }
},[list]);

    const handleEmojiClick = (e, emojiObject) => {/*onde sabe qual emoji escolhido clicado */
        setText( text + emojiObject.emoji )/*concatena emoji + texto digitação */
      }
      const handleOpenEmoji = () => {/*função clique abrir emoji */
        setEmojiOpen(true);/*true abrindo altura de pixel css e aparecendo emojis */
      }
      const handleCloseEmoji = () => {/*função clicar X fechar emoji */
        setEmojiOpen(false);/*false fechando emoji */
      }

      const handleMickClick = () => {/*editando click do microfone */
        console.log('oi');
        if(recognition !== null) {//verifica se recognition ou  reconhecimento esta diferente de nulo
        
           // Começou a escutar true
      recognition.onstart = () => {
        setListening(true)
        console.log('gravando');
      }

      // Terminou de escutar, parou
      recognition.onend = () => {
        setListening(false)
        console.log('parou só funciona no browser google chrome');
      }

      // qdo receber o resultado
      recognition.onresult = (e) => {
        setText(e.results[0][0].transcript);//2 arrays transcrição
        /*console.log(e.results[0][0].transcript)*/
      }

      recognition.start();//manda escutar de vez
        }
      }

      const handleInputkeyUp = (e) => {//monitora se clicou teclado
        if(e.keyCode === 13){//13 === enter do teclado
          handleSendClick();//clicou
        }
      }
    
      const handleSendClick = () => {//ou usou mouse > enviar
        if(text !== '') {//se digitou algo
          Api.sendMessage(data, user.id, 'text', text, users);//coloca api mensagem de api.js 
          setText('');
          setEmojiOpen(false);
        }
      }

    return (
        <div className="chatWindow">{/*div principal */}
            <div className="chatWindow--header">{/**cabeçario, logo, titulo, icones */}
            
            <div className="chatWindow--headerinfo">{/*area de informaçoes do usuario, avatar, titulo */}
            <img className="chatWindow--avatar" src={data.image} alt=""/>
          <div className="chatWindow--name">{data.title}</div>{/*titulo e imagem chat no firebase usando data... - {data.chatId}   :mostra id do chat */}
            </div>
        
            <div className="chatWindow--headerbuttons">{/*botoes do cabeçario */}
          <div className="chatWindow--btn">{/*um botão de lupa icone q foi importada */}
            <SearchIcon style={{color: "#919191"}} />
          </div>
          <div className="chatWindow--btn">{/*grrampo */}
            <AttachFileIcon style={{color: "#919191"}} />
          </div>
          <div className="chatWindow--btn">{/*tres pontinhos icone botão */}
            <MoreVertIcon style={{color: "#919191"}} />
          </div>
        </div>
             </div>{/**final cabeçario */}

            <div ref={body} className="chatWindow--body">{/** corpo chat.. ref body hook para utilizar com */}
            {list.map((item, key)=>(/*componente propria mensagem e user do usuario */
          <MessageItem
            key={key}
            data={item}
            user={user}
          />
        ))}
                </div>{/**final corpo */} 

                <div className="chatWindow--emojiarea"style={{height: emojiOpen ? '320px' : '0px'}}>{/*area onde aparece emojis ao clicar no icone emoji,disableSearchBar: cor emoji, inclue style height pelo useStates emojiopen true 200px se não 0px */}
        <EmojiPicker
        onEmojiClick={handleEmojiClick}
        disableSearchBar
        disableSkinTonePicker
        />{/*handleEmojiClick: ao clicar vai na funçao */}
      </div>
           
            <div className="chatWindow--footer">{/**digitavel batepapo */}
            <div className="chatWindow--pre">{/*icones esquerda */}
            <div className="chatWindow--btn"
            onClick={handleCloseEmoji} style={{width: emojiOpen ? 40 : 0 }}>{/*ação de clicar fechar opçoes de emoji, se tiver emojiopen 40 se não 0 */}
                <CloseIcon style={{color:'#919191'}} />{/*fechar opçoes emoji aberta */}
            </div>
            <div className="chatWindow--btn"
            onClick={handleOpenEmoji}>{/*botão de abrir emoji */}
                <InsertEmoticonIcon style={{color: emojiOpen ? "#009688" : '#919191'}} />{/*emojiopen icone for true uma cor se não outra */}
            </div>
            </div>
            <div className="chatWindow--inputarea">{/*meio imput maior digitavel especifico */}
            <input className="chatWindow--input"type="text"
            placeholder="Digite uma mensagem"
            value={text}
            onChange={e=>setText(e.target.value)}
            onKeyUp={handleInputkeyUp}
            />{/*value text: texto sendo criado salva com onchange setText, onKeyUp qualquer tecla q digitar.. */}
            </div>
            <div className="chatWindow--pos">{/*icones direita */}

            {text === '' && 
            <div onClick={handleMickClick} className="chatWindow--btn">
              <MicIcon style={{color: listening ? "#126ECE" : "#919191"}} />{/*icone do microfone e cor se tiver escutando azul, outra cor se não */}
            </div>     
          }{/* text === '' && se text estiver vazio mostra o microfone */}{/*onClick={handleMickClick}ao clicar microfone */}

           { text !== '' &&
            <div onClick={handleSendClick} className="chatWindow--btn">{/*click */}
                <SendIcon style={{color:'#919191'}} />{/*icone enviar */}
            </div>
            }{/* text !== '' && se text estiver digitado algo não mostra o microfone e sim > enviar */}

            </div>
                </div>{/**final digitavel */}
        </div>
    );
};