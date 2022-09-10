export const rootUrl = 'http://localhost:8000/';
export const apiUrl = `${rootUrl}api/`;

//user
export const userApi = apiUrl + 'user/';
export const createUser = userApi + 'create';
export const getAllUser = userApi + 'getAll';
export const getUser = userApi + 'getOne/';
export const updateUser = userApi + 'update/';
export const deleteUser = userApi + 'delete/';

//auth
export const authApi = apiUrl + 'auth/';
export const loginApi = authApi + 'login';
export const logoutApi = authApi + 'logout';

//carousel
export const carouselApi = apiUrl + 'carousel/';
export const createCarousel = carouselApi + 'create';
export const getAllCarousel = carouselApi + 'getAll';
export const getCarousel = carouselApi + 'getOne/';
export const updateCarousel = carouselApi + 'update/';
export const deleteCarousel = carouselApi + 'delete/';
export const deleteManyCarousel = carouselApi + 'deleteMany';


//carousel
export const youtubelApi = apiUrl + 'youtube/';
export const createYoutube = youtubelApi + 'create';
export const getAllYoutube = youtubelApi + 'getAll';
export const getYoutube = youtubelApi + 'getOne/';
export const updateYoutube = youtubelApi + 'update/';
export const deleteYoutube = youtubelApi + 'delete/';
export const deleteManyYoutube = youtubelApi + 'deleteMany';
