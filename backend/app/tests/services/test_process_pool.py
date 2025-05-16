import uuid
from unittest.mock import patch

import pytest
from app.services.process_pool import ProcessPool


class TestProcessPool:
    @pytest.fixture
    def process_pool(self):
        return ProcessPool()

    @patch('app.services.session_process.SessionProcess.execute_code')
    async def test_execute(self, mock_execute_code, process_pool):
        mock_execute_code.return_value = "exec_id"
        session_id = str(uuid.uuid4())
        code = "print('Hello, World!')"
        result = await process_pool.execute(code, session_id)
        assert result == {
            "execution_id": "exec_id",
            "status": "pending",
            "result": None
        }
        assert session_id in process_pool.sessions

    async def test_remove(self, process_pool):
        session_id = str(uuid.uuid4())
        process_pool._create_session(session_id)
        assert session_id in process_pool.sessions
        process_pool.remove(session_id)
        assert session_id not in process_pool.sessions
