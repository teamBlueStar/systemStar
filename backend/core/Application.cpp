#include "Application.h"

#include <chrono>
#include <thread>

Application::Application()
    : running_(false)
{
}

void Application::run()
{
    running_.store(true);

    while (running_.load()) {
        std::this_thread::sleep_for(
            std::chrono::milliseconds(100)
        );
    }
}

void Application::stop()
{
    running_.store(false);
}
