type IconProps = { size?: number; color?: string; fill: string };

export const IconCheck = ({ size = 20, color = "white", fill = "none" }: IconProps) => (
  <svg
    viewBox="0 0 20 20"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
  >
    <g id="Checkbox">
      <rect id="Rectangle 2" width="20" height="20" rx="6" fill="#C74D2F" />
      <g id="Check">
        <path
          id="Vector"
          d="M14.6875 5.31213L8.39917 14.2951C8.3162 14.4143 8.20609 14.5121 8.07791 14.5804C7.94973 14.6487 7.80715 14.6856 7.66192 14.688C7.51669 14.6904 7.37297 14.6582 7.2426 14.5942C7.11223 14.5302 6.99895 14.436 6.91208 14.3196L5.3125 12.1871"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
  </svg>
);

export const IconHeart = ({ size = 20, color = "white", fill = "none" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
  >
    <g id="Favorite">
      <path
        id="Vector"
        d="M12 21.844L2.41202 11.844C1.56935 11.002 1.01318 9.91606 0.82238 8.7402C0.631579 7.56434 0.815836 6.35825 1.34902 5.293C1.75108 4.48912 2.33839 3.79227 3.06257 3.25988C3.78674 2.72749 4.62706 2.37479 5.51427 2.23085C6.40149 2.0869 7.31021 2.15583 8.16557 2.43194C9.02092 2.70806 9.79843 3.18347 10.434 3.819L12 5.384L13.566 3.819C14.2016 3.18347 14.9791 2.70806 15.8345 2.43194C16.6898 2.15583 17.5985 2.0869 18.4858 2.23085C19.373 2.37479 20.2133 2.72749 20.9375 3.25988C21.6617 3.79227 22.249 4.48912 22.651 5.293C23.1835 6.35784 23.3674 7.56321 23.1768 8.7384C22.9862 9.91359 22.4307 10.999 21.589 11.841L12 21.844Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);
