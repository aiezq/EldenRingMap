import React from 'react';
import styles from './header.module.scss';

export const Header = () => {
    return (
        <div className={styles.container}>
{/*             <svg
                width="90"
                height="39"
                viewBox="0 0 90 39"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M22.9216 36.3878L20.9459 38.3704C20.1093 39.2099 18.7565 39.2099 17.9288 38.3704L0.627441 21.0182C-0.209147 20.1787 -0.209147 18.8213 0.627441 17.9907L17.9288 0.629608C18.7654 -0.209869 20.1182 -0.209869 20.9459 0.629608L22.9216 2.61221C23.7671 3.46061 23.7493 4.84486 22.886 5.67541L12.1617 15.9278H87.864C89.0477 15.9278 90 16.8833 90 18.0711V20.9289C90 22.1167 89.0477 23.0722 87.864 23.0722H12.1617L22.886 33.3246C23.7582 34.1551 23.776 35.5394 22.9216 36.3878Z"
                    fill="white"
                />
            </svg> */}
            <h1 className={styles.header}>Elden Ring Map</h1>
        </div>
    );
};
