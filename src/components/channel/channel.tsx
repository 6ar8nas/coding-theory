import React from 'react';
import channelUrl from '../../assets/channel.png';
import './channel.scss';

export const Channel = (): React.JSX.Element => {
    return (
        <div role="img" className="coding-theory-channel-img" aria-label="Binary data streaming channel illustration">
            <img src={channelUrl} title="Channel" />
        </div>
    );
};
