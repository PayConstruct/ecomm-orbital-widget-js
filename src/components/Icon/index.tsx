import React, { useEffect, useState } from 'react'
import BlackBlueIcon from '../../assets/logo-icon-black-blue.svg'
import BlackRedIcon from '../../assets/logo-icon-black-red.svg'
import WhiteBlueIcon from '../../assets/logo-icon-white-blue.svg'
import WhiteRedIcon from '../../assets/logo-icon-white-red.svg'
import BlackRedWordIcon from '../../assets/logo-word-black-red.svg'
import BlackWhiteWordIcon from '../../assets/logo-word-black-white.svg'
import WhiteRedWordIcon from '../../assets/logo-word-white-red.svg'
import { InitOptions } from '../../types'
import { useIframeContext } from '../../context/IframeContext'

type IconType = {
  icon: string
  wordIcon: string
}

function getIcons({ color }: NonNullable<InitOptions['button']>): IconType {
  switch (color) {
    case 'black-white':
      return { icon: WhiteRedIcon, wordIcon: WhiteRedWordIcon }
    case 'red-white':
      return { icon: WhiteBlueIcon, wordIcon: WhiteRedWordIcon }
    case 'red-black':
      return { icon: BlackBlueIcon, wordIcon: BlackWhiteWordIcon }
    case 'blue-white':
      return { icon: WhiteRedIcon, wordIcon: WhiteRedWordIcon }
    default:
      return { icon: BlackRedIcon, wordIcon: BlackRedWordIcon }
  }
}

const LogoIcon = () => {
  const { color, logoOnly } = useIframeContext().options?.button || {}
  const [icons, setIcons] = useState<IconType>(getIcons({ color }))
  useEffect(() => {
    setIcons(getIcons({ color }))
  }, [color, logoOnly])

  return <img src={logoOnly ? icons.icon : icons.wordIcon} alt="Orbital Logo" />
}

export default LogoIcon
