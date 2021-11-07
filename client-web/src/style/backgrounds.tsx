// All backgrounds purchased are used under license of Shutterstock,
// downloaded via the james@sevenstripes.jp account.

import AirplaneOverMountains from './backgrounds/airplane-over-mountains.svg?url'
import CityCenter from './backgrounds/city-center.svg?url'
import HorseInWilderness from './backgrounds/horse-in-wilderness.svg?url'
import HotAirBalloon from './backgrounds/hot-air-balloon.svg?url'
import MountainVillage from './backgrounds/mountain-village.svg'
import SailingShips from './backgrounds/sailing-ships.optimized.svg'
import SteamTrain from './backgrounds/steam-train.svg?url'
import WindTurbines from './backgrounds/wind-turbines.svg?url'
import WinterCabin from './backgrounds/winter-cabin.svg?url'

export interface BackgroundLoader {}

export const backgrounds = [
  // First step is our "you've taken the first step" letter. It should contain
  // both the sailing ships and the mountain village, i.e. "setting sail".
  {
    ComponentRight: SailingShips,
    ComponentLeft: MountainVillage,
  },

  // Writing your first letter: you get a cozy little cabin.
  {
    url: WinterCabin,
  },

  // Register: hop on the train
  {
    url: SteamTrain,
  },

  // Pick your plan: nantonaku, hot air balloon works
  {
    url: HotAirBalloon,
  },

  // Pick (and pay for) your address: at the top of a big tower
  {
    url: CityCenter,
  },

  // Confirmation - taking flight
  {
    url: AirplaneOverMountains,
  },

  // Thankyou: you're
  {
    url: HorseInWilderness,
  },

  // Login page:
  {
    url: WindTurbines,
  },
]
