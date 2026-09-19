#include "../backend/core/Application.h"

#include <chrono>
#include <thread>

int main()
{
    Application application;

    std::thread applicationThread([&application]() {
        application.run();
    });

    std::this_thread::sleep_for(
        std::chrono::milliseconds(150)
    );

    application.stop();

    applicationThread.join();

    return 0;
}
