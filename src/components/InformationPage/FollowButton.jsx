
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import useFollow from '../../hooks/useFollow';
import { useParams } from 'react-router-dom';
import Loading from '../Loading';
import { useEffect, useState } from 'react';
import useSessionStorage from '../../hooks/useSessionStorage';
import { useTranslation } from 'react-i18next';
import useScreenSize from '../../hooks/useScreenSize';


const FollowButton = () => {
    const {t} = useTranslation()
    const {windowWidth} = useScreenSize()
    const { loading, listFollowed, followConference, unfollowConference, getListFollowedConferences } = useFollow()
    const {getDataListInStorage} = useSessionStorage()
    const [isClick, setIsClick] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [status, setStatus] = useState(false)
    const id = useParams()

    useEffect(() => {
        const res = isCheck(id.id);
        setIsFollowing(res);
    }, [id, listFollowed]);

    useEffect(() => {
        const fetchData = async () => {
            const followedList = getDataListInStorage('listFollow')
            if(followedList.length === 0 || !followedList){
                await getListFollowedConferences();
            }
            const res = isCheck(id.id);
            setIsFollowing(res);
        };
        fetchData();
    }, [id, isClick])


    const handleFollow = async () => {
        setIsClick(true)
        const result = await followConference(id.id)
        setStatus(result)
    }


    const handleUnfollow = async () => {
        setIsClick(true)
        const result = await unfollowConference(id.id)
        setStatus(result)
    }

    const isCheck = (idToCheck) => {
        const check = listFollowed.some(item => item.id === idToCheck);

        return check
    };
    return (
        <>
            {
                isFollowing
                    ?
                    <OverlayTrigger
                        placement="bottom"
                        overlay={
                            <Tooltip id={'tooltip-bottom'}>
                               {t('followed')}
                            </Tooltip>
                        }
                    >

                        <div>
                            <Button
                                className={
                                    `text-nowrap d-flex justify-content-center align-items-center rounded-5 btn-wave-wrap fs-4
                                    ${windowWidth > 768 ? 'm-2 px-5 py-3  fw-semibold ' : 'm-2 p-2'}
                                `
                                }
                                onClick={handleUnfollow}
                            >
                                {
                                    loading
                                        ?
                                        <Loading size={'sm'}/>
                                        :
                                        `${t('followed')}`
                                }
                            </Button>
                        </div>
                    </OverlayTrigger>
                    :
                    <OverlayTrigger
                        placement="bottom"
                        overlay={
                            <Tooltip id={'tooltip-bottom'}>
                                {t('title_follow')}
                            </Tooltip>
                        }
                    >


                        <div className=''>
                            <Button
                                className={
                                    `text-nowrap d-flex justify-content-center align-items-center rounded-5 btn-wave-wrap fs-5 
                                        ${windowWidth > 768 ? 'm-2 px-5 py-3   fw-semibold ' : 'm-2 p-2'}
                                    `
                                }
                                onClick={handleFollow}
                            >
                                {
                                    loading
                                        ?
                                        <Loading size={'sm'}/>
                                        :
                                        `${t('follow')}`
                                }
                            </Button>
                        </div>
                    </OverlayTrigger>
            }
        </>

    );
};

export default FollowButton;
