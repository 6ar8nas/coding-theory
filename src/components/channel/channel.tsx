import React from 'react';
import channelUrl from '../../assets/channel.png';
import './channel.scss';

export const Channel = (): React.JSX.Element => {
    return (
        <div className="coding-theory-channel-img" aria-description="Channel">
            <img src={channelUrl} alt="Channel" title="Channel" />
        </div>
    );
};
