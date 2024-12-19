export const URL = `${process.env.NEXT_PUBLIC_API_URL}`;
export const api = `${process.env.NEXT_PUBLIC_API_URL}/`;

export const EndPoints = {
  // Auth EndPoints
  login: `${api}user/login`,
  register: `${api}register`,
  logout: `${api}logout`,
  refreshToken: `${api}refresh-token`,
  category_film: `${api}movie/category`,
  series: {
    getAllSeries: `${api}series/all`,
    addSeries: `${api}series/add`,
    updateSeries: (id: number) => `${api}series/${id}`,
    deleteSeries: (id: string) => `${api}series/${id}`,
    getOneSeries: (id: string) => `${api}series/all/${id}`,
    addOneSerieSseason: (id: string) => `${api}series/season/add/${id}`,
    addEpisode: `${api}episode/add`,
    addSessonNumber: (id: string) => `${api}series/season/add/${id}`,
    deleteSesson: (id: string) => `${api}series/season/${id}`,
    updateEpisode: (id: number) => `${api}episode/${id}`,
    deleteEpisode: (id: string) => `${api}episode/${id}`,
    getOneSessonByID: (id: string) => `${api}episode/season/${id}`,
  },
  film: {
    getAllFilm: `${api}movie/all`,
    addFilm: `${api}movie/add`,
    updateFilm: (id: number) => `${api}movie/${id}`,
    deleteFilm: (id: string) => `${api}movie/${id}`,
  },
  zhanar: {
    addZhanar: `${api}zhanar/add`,
    getAllZhanar: (page: string) => `${api}zhanar/all?page=${page || 1}`,
    updateZhanar: (id: number) => `${api}zhanar/${id}`,
    deleteZhanar: (id: string) => `${api}zhanar/${id}`,
  },
  customer: {
    getAllCustomer: (search: any, status: any, plan: any, page: any) => {
      const queryParams = [];

      if (search) {
        queryParams.push(`keyword=${search}`);
      }

      if (status) {
        queryParams.push(`state=${status}`);
      }
      if (plan) {
        queryParams.push(`plan_id=${plan}`);
      }
      const queryString =
        queryParams.length > 0 ? `${queryParams.join("&")}` : "";
      return `${api}customer/all?page=${page || 1}&${queryString}`;
    },
    deActiveCustomer: (id: string) => `${api}customer/${id}`,
  },
  active_code: {
    getAllActiveCode: (status: any, plan: any, page: any) => {
      const queryParams = [];

      if (status) {
        queryParams.push(`state=${status}`);
      }
      if (plan) {
        queryParams.push(`plan_id=${plan}`);
      }
      const queryString =
        queryParams.length > 0 ? `${queryParams.join("&")}` : "";
      return `${api}activation/all?page=${page || 1}&${queryString}`;
    },
    addCode: `${api}activation/add`,
    deleteCode: (id: string) => `${api}activation/${id}`,
  },
  plan: {
    getAllPlan: `${api}plan/all?state=true`,
    getAllPlanWithDeActive: `${api}plan/all`,
    addPlan: `${api}plan/add`,
    updatedPlan: (id: number) => `${api}plan/${id}/`,
    deltePlan: (id: string) => `${api}plan/${id}/`,
  },
  admin: {
    getAllRole: `${api}role/get/all`,
    getAllPermission: `${api}role/get/permissions`,
    getOneRoleID: (id: string) => `${api}role/get/one/${id}`,
    addRole: `${api}role/add`,
    updateRole: (id: number) => `${api}role/update/${id}`,
    deleteRole: (id: string) => `${api}role/delete/${id}`,
  },
  user: {
    getAllUser: `${api}user/all`,
    addUser: `${api}user/add`,
    updateUser: (id: number) => `${api}user/${id}`,
    deleteUser: (id: string) => `${api}user/${id}`,
  },
  reklam: {
    getAllReklam: `${api}reklam/all`,
    addReklam: `${api}reklam/add`,
    updateReklam: (id: number) => `${api}reklam/${id}`,
    deleteReklam: (id: string) => `${api}reklam/${id}`,
  },
};
