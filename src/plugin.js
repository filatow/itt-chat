import videojs from 'video.js';
import {version as VERSION} from '../package.json';

const Plugin = videojs.getPlugin('plugin');
const Dom = videojs.dom;

// Plugin constants and enums.
const CSSCustomProperty = {
  BASE_FONT_SIZE: '--base-font-size',
  INPUT_FONT_SIZE_RATIO: '--input-font-size-ratio',
  CONTROL_BAR_HEIGHT: '--control-bar-height',
  OFFSET_Y: '--offset-y',
  MIN_WIDTH: '--min-width',
  OPT_WIDTH: '--opt-width',
  MAX_WIDTH: '--max-width'
}

// Default options for the plugin.
const defaults = {
  // Message font-size and the base for the most sizes and indents calculation.
  baseFontSize: 20,
  // New message input font-size ratio relative to 'baseFontSize'.
  inputFontSizeRatio: 1,
  // Height of the controlBar depends on the player visual skin.
  controlBarHeight: 30,
  //Optional vertical adjustment.
  offsetY: 0,
  // Needed for widget minimum width calculation.
  minViewportWidth: 320,
  // Optimal width for wide players (px).
  optWidth: 600,
  // Maximum width for wide players (%).
  maxPercentWidth: 45
};

/**
 * VideoJS chat plugin class (Inventos Test Task)
 */
class IttChat extends Plugin {
  /**
   * IttChat constructor.
   *
   * @param {Player} player - The videojs player instance.
   * @param {Object} options - The plugin options.
   */
  constructor(player, options) {
    super(player);

    this.options = videojs.mergeOptions(defaults, options);
    this.player.on('ready', this.onReady);
    this.player.one('playing', this.onFirstPlaying);
    this.on('statechanged', this.updateMessageList);
  }

  onReady = () => {
    this.player.addClass('vjs-videojs-itt-chat');

    const storedMessages = localStorage.getItem('ITTChat.messages');

    if (storedMessages) {
      this.setState({
        messages: JSON.parse(storedMessages)
      });
    } else {
      this.setState({messages: []})
    }
  }

  onFirstPlaying = () => {
    const playerEl = this.player.el();
    const chatBox = this.createChatBox();
    const messageList = this.createMessageList();
    const newMessageBox = this.createNewMessageBox();

    playerEl.appendChild(chatBox);
    chatBox.appendChild(messageList);
    chatBox.appendChild(newMessageBox);

    this.applyOptions();
    messageList.scrollTop = messageList.scrollHeight;
  }

  applyOptions = () => {
    const baseFontSize = this.options.baseFontSize + 'px';
    const inputFontSizeRatio = this.options.inputFontSizeRatio;
    const controlBarHeight = this.options.controlBarHeight + 'px';
    const offsetY = Math.abs(this.options.offsetY);
    const minWidth = this.options.minViewportWidth - this.options.baseFontSize + 'px';
    const optWidth = this.options.optWidth + 'px';
    const maxWidth = this.options.maxPercentWidth + '%';

    const root = document.documentElement;

    root.style.setProperty(CSSCustomProperty.BASE_FONT_SIZE, baseFontSize);
    root.style.setProperty(CSSCustomProperty.INPUT_FONT_SIZE_RATIO, inputFontSizeRatio);
    root.style.setProperty(CSSCustomProperty.CONTROL_BAR_HEIGHT, controlBarHeight);
    root.style.setProperty(CSSCustomProperty.OFFSET_Y, offsetY);
    root.style.setProperty(CSSCustomProperty.MIN_WIDTH, minWidth);
    root.style.setProperty(CSSCustomProperty.OPT_WIDTH, optWidth);
    root.style.setProperty(CSSCustomProperty.MAX_WIDTH, maxWidth);
  }

  createChatBox = () => {
    const chatBox = Dom.createEl('div', {
      className: 'vjs-chatbox',
    });

    return chatBox;
  }

  createMessageList = () => {
    const messageList = Dom.createEl('ul', {
      className: 'vjs-chatbox-list'
    });

    this.state.messages.forEach(message => {
      const messageEl = Dom.createEl('li', {
        className: 'vjs-chatbox-message',
        innerText: message
      });

      messageList.appendChild(messageEl);
    });

    return messageList;
  }

  createNewMessageBox = () => {
    const newMessageBox = Dom.createEl('div', {
      className: 'vjs-chatbox-new'
    });

    const newMessageInput = this.createNewMessageInput();
    const newMessageSendButton = this.createNewMessageSendButton();

    newMessageBox.appendChild(newMessageInput);
    newMessageBox.appendChild(newMessageSendButton);

    return newMessageBox;
  };

  createNewMessageInput = () => {
    const newMessageInput = Dom.createEl('input', {
      className: 'vjs-chatbox-new-input',
      type: 'text',
      placeholder: 'Type and send...'
    });

    newMessageInput.addEventListener('keyup', this.sendMessage);

    return newMessageInput;
  }

  createNewMessageSendButton = () => {
    const newMessageSendButton = Dom.createEl('button', {
      className: 'vjs-chatbox-new-send',
      type: 'button'
    });

    newMessageSendButton.addEventListener('click', this.sendMessage);

    return newMessageSendButton;
  }

  updateMessageList = () => {
    const messageList = Dom.$('.vjs-chatbox-list', this.player.el());
    if (!messageList) return;

    const newMessage = this.state.messages[this.state.messages.length - 1];
    const messageEl = Dom.createEl('li', {
      className: 'vjs-chatbox-message',
      innerText: newMessage
    });

    messageList.appendChild(messageEl);
    messageList.scrollTop = messageList.scrollHeight;
  }

  sendMessage = (event) => {
    const newMessageInput = Dom.$('.vjs-chatbox-new-input', this.player.el());
    if (!newMessageInput.value) return;

    const targetIsInput = event.target.tagName === 'INPUT';
    const targetIsButton = event.target.tagName === 'BUTTON';
    const enterIsPressed = event.code === 'Enter';

    if ((targetIsInput && enterIsPressed) || targetIsButton) {
      this.saveNewMessage(newMessageInput.value);
      newMessageInput.value = '';
    }
  }

  saveNewMessage = (newMessage) => {
    this.setState({
      messages: [...this.state.messages, newMessage]
    });
    localStorage.setItem('ITTChat.messages', JSON.stringify(this.state.messages));
  }
}

// Default values for the plugin's `state` object.
IttChat.defaultState = {};

// Include the version number.
IttChat.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('ittChat', IttChat);

export default IttChat;
