import { useSelector } from 'react-redux'
import { selectCharacterStats } from '../../../../../redux/GameplaySlices/PlayerStatsSlice'
import { FormatNumberWithDots } from '../../../../../Tools/Utils'
import ProgressBar from '../../../../Common/ProgressBar/progress-bar'
import './stats-panel.scss'
import StatValue from './StatValue/stat-value'

export default function StatsPanel({styles}) {
  const userStats = useSelector(selectCharacterStats)
  return (
    <div className={'stats-panel'}>
      <div className='gold-line'>
        <span className='gold'>
          <img className='stats-icon' src={require('../../../../../assets/Icons/gameplay/ico_stats_coins.png')} />
          <p>{FormatNumberWithDots(userStats.gold)}</p>
        </span>
        <span className='agi'>
          <img className='stats-icon' src={require('../../../../../assets/Icons/gameplay/ico_stats_agi.png')} />
          <p>{userStats.agi}</p>
        </span>
        <span className='str'>
          <img className='stats-icon' src={require('../../../../../assets/Icons/gameplay/ico_stats_str.png')} />
          <p>{userStats.str}</p>
        </span>
      </div>
      <span className='separator-line'></span>
      <div className='hp-line'>
        <img className='' src={require('../../../../../assets/Icons/gameplay/ico_stats_health.png')} />
        <ProgressBar styles='hp-bar-outer' 
                    currentVal={userStats.currentHp} 
                    MaxValue={userStats.maxHp} 
                    displayMax={true} barStyle='hp-bar'
                    extraFill={userStats.currentShield} extraStyle='extra-style'/>
      </div>
      <div className='mana-line'>
        <img className='' src={require('../../../../../assets/Icons/gameplay/ico_stats_mana.png')} />
        <ProgressBar styles='mana-bar-outer' currentVal={userStats.currentMana} MaxValue={userStats.maxMana} displayMax={true} barStyle='mana-bar'/>
      </div>
      <div className='energy-line'>
      <img className='stats-icon' src={require('../../../../../assets/Icons/gameplay/ico_stats_stamina.png')} />
      <ProgressBar styles='energy-bar-outer' currentVal={userStats.currnetEnergy} MaxValue={userStats.maxEnergy} displayMax={true} barStyle='energy-bar'/>
      <img className='stats-icon' src={require('../../../../../assets/Icons/gameplay/ico_stats_thirst.png')} />
      <ProgressBar styles='drink-bar-outer' currentVal={userStats.drink} MaxValue={100} displayMax={false} barStyle='drink-bar'/>
      <img className='stats-icon' src={require('../../../../../assets/Icons/gameplay/ico_stats_hunger.png')} />
      <ProgressBar styles='food-bar-outer' currentVal={userStats.food} MaxValue={100} displayMax={false} barStyle='food-bar'/>
      </div>
      <span className='separator-line'></span>
      <div className='defense-area'>
        <StatValue icon={require('../../../../../assets/Icons/gameplay/ico_stats_sword.png')}>{userStats.weapon.min + "/" + userStats.weapon.max}</StatValue>
        <StatValue icon={require('../../../../../assets/Icons/gameplay/ico_stats_shield.png')}>{userStats.shield.min + "/" + userStats.shield.max}</StatValue>
        <StatValue icon={require('../../../../../assets/Icons/gameplay/ico_stats_helmet.png')}>{userStats.helm.min + "/" + userStats.helm.max}</StatValue>
        <StatValue icon={require('../../../../../assets/Icons/gameplay/ico_stats_armor.png')}>{userStats.armor.min + "/" + userStats.armor.max}</StatValue>
        <StatValue iconStyle='magic-armor' icon={require('../../../../../assets/Icons/gameplay/ico_stats_magicshield.png')}>+{userStats.magicBonus}</StatValue>
        <StatValue icon={require('../../../../../assets/Icons/gameplay/ico_stats_magic.png')}>+{userStats.magicDef}%</StatValue>
      </div>
    </div>
  )
}