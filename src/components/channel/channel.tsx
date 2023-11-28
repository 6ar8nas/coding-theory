import React from 'react';
import channelUrl from '../../assets/channel.png';
import './channel.scss';

export type ChannelProps = {
    valueBefore: string;
    valueAfter: string;
    errorMessage?: string;
};

export const Channel = (): React.JSX.Element => {
    return (
        <div className="coding-theory-channel-img" aria-description="Channel">
            <img src={channelUrl} alt="Channel" title="Channel" />
        </div>
    );
};
