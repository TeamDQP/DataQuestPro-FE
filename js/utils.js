async function isTokenValid(token) {
    try {
        const response = await axios.get(
            'http://127.0.0.1:8000/user/validate-jwt/',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.status === 200;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export { isTokenValid };
