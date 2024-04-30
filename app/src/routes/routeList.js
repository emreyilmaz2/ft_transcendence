import Login, { initLoginEvents } from '../pages/auths/login';
import Register, { initRegisterEvents }  from '../pages/auths/register';
import Profile, { initProfileEvents } from '../pages/profile';
import ProfileSetting, { initProfileSettingEvents }  from '../pages/profilesetting';
import Dashboard, { initDashboardEvents, destroyDashboardEvents } from '../pages/dashboard';

import Game, { initGameEvents } from '../pages/game';
import LocalGame, { initLocalGameEvents } from '../pages/localGame';
import AIGame, { initAIGameEvents } from '../pages/aiGame';
import TournamentGame, { initTournamentGameEvents } from '../pages/tournamentGame';
import matchGame, { initMatchmakingGameEvents } from '../pages/matchmakingGame';
import pongGame, { runGame } from '../pages/pongGame';
import pongGameT, { runGameT } from '../pages/pongGameT';
import pongGameAI, { runGameAI } from '../pages/pongAI';

import Friends, { initFriendsEvents, destroyFriendsEvents } from '../pages/friends';
import FriendsAll, { initFriendsAllEvents , destroyFriendsAllEvents } from '../pages/friendsAll';
import FriendsP, { initFriendsPEvents , destroyFriendsPEvents } from '../pages/friendsP';
import FriendsAdd, { initFriendsAddEvent, destroyFriendsAddEvents } from '../pages/friendsAdd';

export const PublicRouteList = {
    '/login': { component: Login, init: initLoginEvents },
    '/register' : { component : Register, init:initRegisterEvents },
};

export const PrivateRouteList = {
    '/dashboard': { id:'dashboard', component: Dashboard, init: initDashboardEvents, destroy: destroyDashboardEvents },
    '/profile':   { component: Profile, init: initProfileEvents },
    
    '/friends'      : { id:'friends',       component:Friends,      init: initFriendsEvents,    destroy: destroyFriendsEvents       },
    '/friendsall'   : { id:'friendsall',    component:FriendsAll,   init:initFriendsAllEvents,  destroy: destroyFriendsAllEvents    },
    '/friendsp'     : { id:'friendsp',      component:FriendsP,     init:initFriendsPEvents,    destroy: destroyFriendsPEvents      },
    '/friendsadd'   : { id:'friendsadd',    component:FriendsAdd,   init:initFriendsAddEvent,   destroy: destroyFriendsAddEvents    },

    '/profilesetting': { component: ProfileSetting, init:initProfileSettingEvents },
    '/game': { component: Game, init: initGameEvents },
    '/match' : { component:matchGame , init:initMatchmakingGameEvents },
    '/aigame' : { component:AIGame, init:initAIGameEvents },
    '/ponggame' : { component:pongGame, init:runGame },
    '/ponggamet' : { component:pongGameT, init:runGameT },
    '/pongAI' : { component:pongGameAI, init: runGameAI },
    '/tournamentgame' : { component:TournamentGame, init:initTournamentGameEvents },
    '/localgame' : { component:LocalGame, init:initLocalGameEvents }
};
