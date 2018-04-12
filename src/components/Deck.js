import classnames from 'classnames'
import Draggable from 'react-draggable'
import debounce from 'lodash.debounce'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { rgb_to_hsv } from 'colorsys'

import Card from './Card'
import Clue from './Clue'
import Icon from './Icon'
import { flip, unFlip } from '../reducers/verso'
import selectHeaderColor from '../selectors/headerColor'
import { MOBILE_OS, ROOT_PATH } from '../utils/config';
import { debug, warn } from '../utils/logguers'

class Deck extends Component {
  constructor (props) {
    super(props)
    this.state = { currentContent: null,
      cursor: 0,
      deckElement: null,
      transition: null,
      isFirstCard: false,
      isFlipping: false,
      isLastCard: false,
      isResizing: false,
      isTransitioning: false,
      items: null
    }
    this.onDebouncedResize = debounce(this.onResize, props.resizeTimeout)
  }

  handleSetStyleCard = (cardProps, cardState) => {
    // only set things for the current Card
    if (cardProps.item !== 0) {
      return
    }
    this.props.isDebug && debug('Deck - handleSetStyleCard')
    // no need to set in state the current cardProps
    this.currentCardProps = cardProps
    this.currentCardState = cardState
    const newState = { isFirstCard: false,
      isLastCard: false
    }
    if (cardProps.isFirst) {
      newState.isFirstCard = true
    } else if (cardProps.isLast) {
      newState.isLastCard = true
    }
    // update
    this.setState(newState)
  }

  handleNextItemCard = diffIndex => {
    // unpack
    const { handleNextItemCard, isDebug } = this.props
    const { items } = this.state
    if (!items) {
      warn('items is not defined')
      return
    }
    isDebug && debug('Deck - handleNextItemCard')
    // new state
    this.items = items.map(index => index + diffIndex)
    const newState = { cursor: 0,
      items: this.items
    }
    // update by shifting the items
    this.setState(newState)
    // hook if Deck has parent manager component
    handleNextItemCard && handleNextItemCard(diffIndex, this)
  }

  handleRelaxItemCard = data => {
    this.props.isDebug && debug('Deck - handleResetItemCard')
    this.setState({ cursor: 0 })
  }

  handleResetItems = (config = {}) => {
    // unpack
    const { isDebug } = this.props
    const contents = config.contents || this.props.contents
    const currentIndex = config.currentIndex || this.props.currentIndex
    if (!contents) {
      return
    }
    isDebug && debug(`Deck - handleResetItems currentIndex=${currentIndex}`)
    // we need to determine the dynamic mapping of the deck
    const items = [...Array(contents.length).keys()]
      .map(index => index - (currentIndex > -1 ? currentIndex : 0))
    this.items = items
    // update
    this.setState({ items })
  }

  handleSetCurrentContent = () => {
    // unpack
    const { items } = this
    const { contents, isDebug } = this.props
    isDebug && debug('Deck - handleSetCurrentContent')
    // find
    const currentIndex = items && items.indexOf(0)
    const previousContent = contents && contents[currentIndex-1]
    const currentContent = contents && contents[currentIndex]
    const nextContent = contents && contents[currentIndex + 1]
    this.currentContent = currentContent
    // add a note if currentContent came from a loading card
    if (this.state.currentContent && this.state.currentContent.isLoading) {
      currentContent.isFromLoading = true
    }
    if (previousContent) {
      previousContent.isFromLoading = false
    }
    if (nextContent) {
      nextContent.isFromLoading = false
    }
    // update
    this.setState({ currentContent, previousContent, nextContent })
  }

  handleSetStyle = () => {
    // unpack
    const { currentContent } = this
    const { transitionTimeout } = this.props
    // style
    const buttonStyle = { transition: `opacity ${transitionTimeout}ms` }
    const style = {
      backgroundColor: 'black',
      transition: `background-color ${transitionTimeout}ms`
    }
    const gradientStyle = {
      background: 'linear-gradient(transparent, black)',
      transition: `background ${transitionTimeout}ms`
    }
    if (currentContent && currentContent.backgroundColor) {
      const [red, green, blue] = currentContent.backgroundColor
      const hue = rgb_to_hsv({r: red, g: green, b: blue}).h
      style.backgroundColor = `hsl(${hue}, 100%, 15%)`
      gradientStyle.background = `linear-gradient(transparent, hsl(${hue}, 100%, 15%))`
    }
    // update
    this.setState({ buttonStyle, gradientStyle, style })
  }

  handleSetReadCard = card => {
    // unpack
    const { handleSetReadCard, isDebug } = this.props
    isDebug && debug('Deck - handleSetReadCard')
    // hook if Deck has parent manager component
    handleSetReadCard && handleSetReadCard(card)
  }

  handleSetCursorCard = cursor => {
    this.props.isDebug && debug('Deck - handleSetCursorCard')
    this.setState({ cursor, transition: 'none' })
  }

  //
  // HORIZONTAL DRAG HANDLING
  //

  // FIX ME !! pour l'instant j'ai remonte les fonctions qui etaient dans CARD
  // donc doit y avoir des props qui etaient definies au niveau Card dans les fonctions
  // juste en dessous

  onHorizontalDrag = (event, data) => {
    /*
    // unpack
    const { deckElement,
      handleSetCursor
    } = this.props
    const { x } = data
    // compute the cursor
    const cursor = x / deckElement.offsetWidth
    // hook
    handleSetCursor && handleSetCursor(cursor)
    */
  }

  onHorizontalStop = (event, data) => {
    /*
    // unpack
    const { isFirst,
      isLast
    } = this.props
    const { x } = data
    // special reset for the CURRENT CARD
    // we need to clear the position given by x and y
    // and transfer the position state into the style state one
    this.setState({
      position: { x:0, y:0 },
      style: Object.assign({}, this.state.style, { left: x })
    })
    // thresholds
    const leftThreshold = - 0.1 * this.element.offsetWidth
    const rightThreshold = 0.1 * this.element.offsetWidth
    if (!isLast && x < leftThreshold) {
      this.handleNextItem(-1)
    } else if (!isFirst && x > rightThreshold) {
      this.handleNextItem(1)
    } else {
      this.handleRelaxItem(data)
    }
    */
  }

  //
  // NEXT TRANSITION HANDLING
  //

  onSlide = (event, diffIndex) => {
    this.props.isDebug && debug('Deck - onSlide')
    event.preventDefault()
    event.stopPropagation()
    this.handleNextItemCard(diffIndex)
  }

  onResize = event => {
    this.props.isDebug && debug('Deck - onResize')
    this.setState({ isResizing: true })
  }

  onTransitionEndCard = (event, cardProps) => {
    // check and unpack
    const { transitions } = this
    const { handleTransitionEnd, isDebug } = this.props
    isDebug && debug('Deck - onTransitionEndCard')
    // update the transitions store
    if (!transitions) {
      warn('transitions is null while we try to update transition end...? weird')
      return
    }
    const newTransitions = [...transitions]
    const transition = newTransitions[cardProps.index]
    if (transition && transition[event.propertyName]) {
        delete transition[event.propertyName]
        if (Object.keys(transition).length === 0) {
          newTransitions[cardProps.index] = false
        }
    }
    this.transitions = newTransitions
    // check
    if (newTransitions.every((newTransition, index) => !newTransition)) {
      handleTransitionEnd && handleTransitionEnd()
      this.setState({ isTransitioning: false })
      this.transitions = null
    }
  }

  onTransitionStartCard = (event, cardProps) => {
    // unpack
    const { transitions } = this
    const { contents,
      handleTransitionStart,
      isDebug
    } = this.props
    isDebug && debug('Deck - onTransitionStartCard')
    // at the first time one of the card is transitioning
    // we init a new array
    let newTransitions
    if (!transitions) {
      newTransitions = [...new Array(contents.length)]
      this.setState({ isTransitioning: true })
      handleTransitionStart && handleTransitionStart()
    } else {
      newTransitions = [...transitions]
    }
    // for this particular card, maybe the transition
    // exists alreay or not
    if (!newTransitions[cardProps.index]) {
      newTransitions[cardProps.index] = { [event.propertyName]: true }
    } else {
      newTransitions[cardProps.index][event.propertyName] = true
    }
    this.transitions = newTransitions
  }

  //
  // VERTICAL DRAG HANDLING
  //
  onVerticalStart = (event, data) => {
    this.props.isDebug && debug('Deck - onStart')
    this.setState({ isFlipping: true, clientY: event.clientY })
  }

  onVerticalDrag = (event, data) => {
    // unpack
    const { flipRatio, isDebug } = this.props
    const { deckElement } = this.state
    isDebug && debug('Deck - onDrag')
    // cursor
    const cursor = (event.clientY - this.state.clientY) / deckElement.offsetHeight
    if (!this.props.isFlipped && cursor < -flipRatio) {
      this.props.flip()
    } else if (this.props.isFlipped && cursor > flipRatio) {
      this.props.unFlip()
    }
  }

  onVerticalStop = (event, data) => {
    this.props.isDebug && debug('Deck - onStop')
    this.setState({ isFlipping: false, y: null })
  }

  componentWillMount() {
    this.handleResetItems(this.props)
  }

  componentWillReceiveProps (nextProps) {
    // unpack
    const { contents } = this.props
    const { isTransitioning } = this.state
    // look for content change
    if (nextProps.contents !== contents) {
      if (!isTransitioning) {
        nextProps.isDebug && debug('Deck - componentWillReceiveProps')
        this.handleResetItems(nextProps)
        // init new state
        // transition to 'none' helps
        // the card to know that they should not remount with a style transition
        // because they are already at the good place
        this.setState({ transition: 'none' })
      }
    }
  }

  componentDidMount () {
    this.handleSetCurrentContent()
    this.setState({ deckElement: this.element })
    MOBILE_OS !== 'unknow' && window.addEventListener('resize', this.onDebouncedResize)
  }

  componentDidUpdate (prevProps, prevState) {
    // unpack
    const { contents,
      isDebug,
      transitionTimeout
    } = this.props
    const { currentContent,
      transition,
      isResizing,
      items
    } = this.state
    // the deck updated because we changed the contents
    // so we need to wait just the refresh of the children
    // card to reset to false the transition
    if (transition === 'none') {
      this.setState({ transition: null })
    }
    // as the deck element has a dynamical width
    // we need to trigger again the set of the style
    // of the children when we resize the window
    if (isResizing && !prevState.isResizing) {
      this.setState({ isResizing: false })
    }
    isDebug && debug('Deck - componentDidUpdate')
    // adapt the items and current content
    if (contents !== prevProps.contents || items !== prevState.items) {
      if (contents && !prevProps.contents) {
        isDebug && debug('Deck - componentDidUpdate handleResetItems')
        this.handleResetItems()
      }
      isDebug && debug('Deck - componentDidUpdate handleSetCurrentContent')
      this.handleSetCurrentContent()
    }
    // adapt style given current content
    if (transitionTimeout !== prevProps.transitionTimeout ||
      currentContent !== prevState.currentContent) {
      this.handleSetStyle()
    }
  }

  componentWillUnmount () {
    MOBILE_OS !== 'unknow' && window.removeEventListener('resize', this.onDebouncedResize)
  }

  render () {
    const {
      handleNextItemCard,
      handleRelaxItemCard,
      handleSetCursorCard,
      handleSetStyleCard,
      handleSetReadCard,
      onHorizontalDrag,
      onHorizontalStop,
      onSlide,
      onTransitionEndCard,
      onTransitionStartCard,
      onVerticalDrag,
      onVerticalStart,
      onVerticalStop
    } = this
    const { children,
      contents,
      extraContents,
      isLoadingBefore,
      isLoadingAfter,
      transitionTimeout,
      readTimeout,
      headerColor,
    } = this.props
    const { buttonStyle,
      currentContent,
      cursor,
      deckElement,
      isFirstCard,
      isFlipping,
      isLastCard,
      isResizing,
      isTransitioning,
      items,
      //nextContent,
      previousContent,
      style,
      transition
    } = this.state
    const isAfterDisabled = !items || isLastCard
    const isAfterHidden = previousContent && previousContent.isLast
    const isBeforeDisabled = !items || isFirstCard
    const isBeforeHidden = currentContent && currentContent.isFirst
    const isLoading = isLoadingBefore || isLoadingAfter
    const isFlipDisabled = !items || isLoading ||
      (currentContent && currentContent.mediation &&
        currentContent.userMediationOffers.length === 0 &&
        currentContent.mediation.thumbCount === 1)

    /*
    const isDraggable = type === 'current' &&
      !isTransitioning &&
      !this.props.isFlipped &&
      !isFlipping
    const bounds = {}
    if (isFirst || (content && content.isFirst)) {
      bounds.right = 0
    } else if (isLast || (content && content.isLast)) {
      bounds.left = 0
    }
    */
    return (
      <Draggable axis='none'
        bounds={{ bottom: 0, top: 0 }}
        onDrag={onVerticalDrag}
        onStart={onVerticalStart}
        onStop={onVerticalStop} >
        <div className='deck'
          id='deck'
          style={style}
          ref={element => this.element = element }>
          {!this.props.unFlippable && (
            <button className={classnames('button close', {
              'button--hidden': !this.props.isFlipped,
              'button--disabled': isTransitioning })}
              onClick={e => this.props.unFlip()} >
              <Icon svg='ico-close' />
            </button>
          )}
          <Draggable axis='x'
            onDrag={onHorizontalDrag}
            onStop={onHorizontalStop} >
            <div className='cards-wrapper flex'>
              {
                items && items.map((item, index) =>
                  contents && contents[index] &&
                  Math.abs(item) < 2 &&
                    <Card content={contents && Object.assign({},
                      contents[index], extraContents && extraContents[index])}
                      contentLength={contents && contents.length}
                      cursor={cursor}
                      deckElement={deckElement}
                      handleSetRead={handleSetReadCard}
                      handleSetStyle={handleSetStyleCard}
                      isFirst={contents && !contents[index - 1]}
                      isFlipping={isFlipping}
                      isLast={contents && !contents[index + 1]}
                      index={index}
                      isResizing={isResizing}
                      isTransitioning={isTransitioning}
                      item={item}
                      transition={transition}
                      transitionTimeout={transitionTimeout}
                      key={index}
                      onTransitionEnd={onTransitionEndCard}
                      onTransitionStart={onTransitionStartCard}
                      readTimeout={readTimeout} />
                )
              }
            </div>
          </Draggable>
          <div className='board-wrapper'>
            <div className='board'
              id='deck__board'
              ref={element => this.boardElement = element}
              style={{
                background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%,${headerColor} 35%,${headerColor} 100%)`,
              }} >
              <ul className='controls' style={{backgroundImage: `url('${ROOT_PATH}/mosaic-w.svg')`,}}>
                <li>
                  <button className={classnames('button before', {
                    'disabled': isBeforeDisabled,
                    'hidden': isBeforeHidden })}
                    disabled={isBeforeDisabled || isBeforeHidden}
                    onClick={event => onSlide(event, 1)}
                    style={buttonStyle}>
                      <Icon svg='ico-prev-w-group' />
                  </button>
                </li>
                <li>
                  <button className={classnames('button to-recto ', {
                    'disabled': isFlipDisabled,
                    'hidden': isLoading || isFlipDisabled })}
                    onClick={e => this.props.flip()}
                    style={buttonStyle} >
                    <Icon svg='ico-slideup-w' />
                  </button>
                  <Clue />
                </li>
                <li>
                  <button className={classnames('button after', {
                    'disabled': isAfterDisabled,
                    'hidden': isAfterHidden })}
                    onClick={event => onSlide(event, -1)}
                    disabled={isAfterDisabled || isAfterHidden}
                    style={buttonStyle} >
                    <Icon svg='ico-next-w-group' />
                  </button>
                </li>
              </ul>
              {children}
            </div>
          </div>
        </div>
      </Draggable>
    )
  }
}

Deck.defaultProps = { deckKey: 0,
  flipRatio: 0.25,
  isDebug: false,
  readTimeout: 3000,
  resizeTimeout: 250,
  transitionTimeout: 500
}

export default connect(
  state => ({
    headerColor: selectHeaderColor(state),
    isFlipped: state.verso.isFlipped,
    unFlippable: state.verso.unFlippable,
  }),
  { flip, unFlip }
)(Deck)
