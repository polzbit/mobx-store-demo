export const validateEmail = (email) => {
    // eslint-disable-next-line
    return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

export const calc_rank = (reviews) => {
    let count_1 = 0,
    count_2 = 0,
    count_3 = 0,
    count_4 = 0,
    count_5 = 0;
    reviews.forEach( (review, i) => {
        if(review.rank === 1) count_1++;
        else if(review.rank === 2) count_2++;
        else if(review.rank === 3) count_3++;
        else if(review.rank === 4) count_4++;
        else if(review.rank === 5) count_5++;

    });
    const total_count = count_1 + count_2 + count_3 + count_4 + count_5
    const total_sum = 1 * count_1 + 2 * count_2 + 3 * count_3 + 4 * count_4 + 5 * count_5;
    return total_sum / total_count;
}