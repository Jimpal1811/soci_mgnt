import api from "./Api";

// create new Protocol
export const CreateProtocol = async (data) =>
  await api.post("/v2/security/addprotocol", data);

// get all Protocol
export const GetProtocols = async () =>
  await api.get("/v2/security/getprotocol");

// get single Protocol by id
export const GetProtocol = async (id) =>
  await api.get(`/v2/security/getprotocol/${id}`);

// delete Protocol by id
export const DeleteProtocol = async (id) =>
  await api.delete(`/v2/security/protocol/${id}`);

//update Protocol by id
export const UpdateProtocol = async (id, data) =>
  await api.patch(`/v2/security/protocol/${id}`, data);
